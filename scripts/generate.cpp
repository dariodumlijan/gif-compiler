#include <filesystem>
#include <iostream>
#include <regex>
#include <string>
#include <vector>
#include <Magick++.h> // dynamic header
// #include "magick/include/ImageMagick-7/Magick++.h" // portable header

namespace fs = std::filesystem;

bool isImage(const fs::directory_entry &entry)
{
    const std::string extension = entry.path().extension();
    return (extension == ".jpg" || extension == ".jpeg" || extension == ".png");
}

bool stringToBool(const std::string &str)
{
    return str == "true";
}

std::vector<std::string> findFoldersWithJpg(const std::string &input_folder)
{
    std::vector<std::string> folders;

    for (const auto &entry : fs::directory_iterator(input_folder))
    {
        if (fs::is_directory(entry))
        {
            bool contains_IMG = false;
            for (const auto &sub_entry : fs::directory_iterator(entry.path()))
            {
                if (isImage(sub_entry))
                {
                    contains_IMG = true;
                    break;
                }
            }

            if (contains_IMG)
            {
                folders.push_back(entry.path().string());
            }

            // Recursively search in subfolders
            // Concatenate the results of the recursive call
            auto subfolders = findFoldersWithJpg(entry.path().string());
            folders.insert(folders.end(), subfolders.begin(), subfolders.end());
        }
    }

    return folders; // Return the vector of folders found
}

void compileGif(const std::string &input_folder, const std::string &output_folder, const std::string &filename, int duration, bool optimize, int quantize)
{
    try
    {
        std::vector<std::string> folders;
        if (fs::is_directory(input_folder))
        {
            folders = findFoldersWithJpg(input_folder);
        }

        for (const auto &folder : folders)
        {
            std::string dimensions;
            std::string folder_path = folder.substr(input_folder.length() + 1);
            std::regex dimensions_pattern("\\d+x\\d+"); // Matches the "numberxnumber" pattern
            std::smatch match;

            if (std::regex_search(folder_path, match, dimensions_pattern))
            {
                dimensions = match[0];
            }

            std::vector<Magick::Image> frames;
            std::vector<std::string> file_list;
            for (const auto &entry : fs::directory_iterator(folder))
            {
                std::string file = entry.path().string();
                std::transform(file.begin(), file.end(), file.begin(), [](unsigned char c)
                               { return std::tolower(c); });
                if (isImage(entry))
                {
                    file_list.push_back(file);
                }
            }

            // Sort the file_list alphabetically
            std::sort(file_list.begin(), file_list.end());

            // Add sorted images to frames array
            for (const auto &file : file_list)
            {
                Magick::Image frame(file);
                frame.animationDelay(duration);
                frame.quantizeColors(256);
                frame.quantizeDither(false);
                frames.push_back(frame);
            }

            fs::create_directories(output_folder);

            std::string extracted_folder_path = folder_path.substr(folder_path.find_first_of('/') + 1); // Start from the second '/'
            std::string formated_folder_path = extracted_folder_path;

            // Replace all '/' with '_'
            for (char &c : formated_folder_path)
            {
                if (c == '/')
                {
                    c = '_';
                }
            }

            std::string filename_sufix = "";
            if (folder_path != extracted_folder_path)
            {
                filename_sufix = "_" + formated_folder_path;
            }

            std::string pattern = R"(\{\s*\{\s*dim\s*\}\s*\})";
            std::string formatted_filename = std::regex_replace(filename, std::regex(pattern), dimensions) + filename_sufix;

            std::string output_filename = output_folder + "/" + formatted_filename + ".gif";

            Magick::quantizeImages(frames.begin(), frames.end(), false);
            Magick::writeImages(frames.begin(), frames.end(), output_filename);

            // OPTIMISATION VERSION
            if (optimize)
            {
                std::vector<Magick::Image> optimized_frames;
                for (const auto &file : file_list)
                {
                    Magick::Image optimizedFrame(file);
                    optimizedFrame.animationDelay(duration);
                    optimizedFrame.quantizeColors(quantize);
                    optimizedFrame.quantizeDither(true);
                    optimized_frames.push_back(optimizedFrame);
                }

                std::string optimized_output_filename = output_folder + "/" + formatted_filename + "_optimized.gif";

                Magick::quantizeImages(optimized_frames.begin(), optimized_frames.end(), true);
                Magick::writeImages(optimized_frames.begin(), optimized_frames.end(), optimized_output_filename);
            }
        }

        int folders_count = folders.size();
        std::cout << folders_count << " GIFs created at: " << output_folder << std::endl;
    }
    catch (Magick::Exception &ex)
    {
        std::cerr << "Error: " << ex.what() << std::endl;
    }
}

int main(int argc, char **argv)
{
    if (argc != 7)
    {
        std::cerr << "Usage: " << argv[0] << " input_folder output_folder filename duration optimize quantize" << std::endl;
        return 1;
    }

    std::string input_folder = argv[1];
    std::string output_folder = argv[2];
    std::string filename = argv[3];
    int duration = std::stoi(argv[4]);
    bool optimize = stringToBool(argv[5]);
    int quantize = std::stoi(argv[6]);

    Magick::InitializeMagick(*argv);
    compileGif(input_folder, output_folder, filename, duration, optimize, quantize);
    return 0;
}
