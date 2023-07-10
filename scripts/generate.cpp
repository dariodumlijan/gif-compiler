#include <filesystem>
#include <iostream>
#include <regex>
#include <string>
#include <vector>
#include "libs/Magick++.h"

namespace fs = std::filesystem;

bool stringToBool(const std::string& str)
{
    return str == "true";
}

void compileGif(const std::string& input_folder, const std::string& output_folder, const std::string& filename, int duration, bool optimize, int quantize) {
    try {
        std::vector<std::string> folders;
        for (const auto& entry : fs::directory_iterator(input_folder)) {
            if (fs::is_directory(entry)) {
                folders.push_back(entry.path().string());
            }
        }

        for (const auto& folder : folders) {
            std::string dimensions = folder.substr(folder.find_last_of('/') + 1);

            std::vector<Magick::Image> frames;
            std::vector<std::string> file_list;
            for (const auto& entry : fs::directory_iterator(folder)) {
                std::string file = entry.path().string();
                std::transform(file.begin(), file.end(), file.begin(), [](unsigned char c) { return std::tolower(c); });
                if (file.length() >= 4 && (file.substr(file.length() - 4) == ".jpg" || file.substr(file.length() - 4) == ".jpeg" || file.substr(file.length() - 4) == ".png")) {
                    file_list.push_back(file);
                }
            }

            // Sort the file_list alphabetically
            std::sort(file_list.begin(), file_list.end());

            // Add sorted images to frames array
            for (const auto& file : file_list) {
                Magick::Image frame(file);
                frame.animationDelay(duration);
                frame.quantizeColors(256);
                frame.quantizeDither(false);
                frames.push_back(frame);
            }

            fs::create_directories(output_folder);

            std::string pattern = R"(\{\s*\{\s*dim\s*\}\s*\})";
            std::string formatted_filename = std::regex_replace(filename, std::regex(pattern), dimensions);
            std::string output_filename = output_folder + "/" + formatted_filename + ".gif";

            Magick::quantizeImages(frames.begin(), frames.end(), false);
            Magick::writeImages(frames.begin(), frames.end(), output_filename);

            // OPTIMISATION VERSION
            if (optimize) {
                std::vector<Magick::Image> optimized_frames;
                for (const auto& file : file_list) {
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
    } catch (Magick::Exception& ex) {
        std::cerr << "Error: " << ex.what() << std::endl;
    }
}

int main(int argc, char** argv) {
    std::string input_folder = argv[1];
    std::string output_folder = argv[2];
    std::string filename = argv[3];
    int duration = std::stoi(argv[4]);
    bool optimize = stringToBool(argv[5]);
    int quantize = std::stoi(argv[6]);

    Magick::InitializeMagick(argv[0]);
    compileGif(input_folder, output_folder, filename, duration, optimize, quantize);
    return 0;
}
