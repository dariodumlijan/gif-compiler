from PIL import Image
import os
import re
import sys

def compile_gif(input_folder, output_folder, filename, duration, max_size):
    # Get a list of all folders inside the root folder
    folders = [folder for folder in os.listdir(input_folder) if os.path.isdir(os.path.join(input_folder, folder))]

    for folder in folders:
        # Get the dimensions from the folder name
        dimensions = folder

        # Create a list to hold the frames
        frames = []

        # Read all JPG files in the current folder in alphabetical order
        file_list = sorted(os.listdir(os.path.join(input_folder, folder)))
        for file in file_list:
            if file.lower().endswith('.jpg') or file.lower().endswith('.jpeg'):
                # Read the JPG file and add it as a frame to the list
                frame = Image.open(os.path.join(input_folder, folder, file))
                frames.append(frame)

        # Create the output folder if it doesn't exist
        os.makedirs(output_folder, exist_ok=True)

        # Generate the output filename with dimensions
        pattern = r"\{\s*\{\s*dim\s*\}\s*\}"
        formated_filename = re.sub(pattern, dimensions, filename)
        output_filename = os.path.join(output_folder, f"{formated_filename}.gif")

        # Save the frames as an animated GIF
        frames[0].save(
            output_filename, 
            save_all=True,
            append_images=frames[1:],
            duration=duration,
            loop=0
        )

        # Check if the file size is within the limit
        filesize = os.path.getsize(output_filename) / 1024
        if filesize > max_size:
            print("Optimizing GIF to reduce file size...")

            # Reduce the number of colors in the GIF
            optimized_frames = [frame.quantize(colors=256) for frame in frames]

            # Generate the optimized output filename
            optimized_output_filename = os.path.join(output_folder, f"{formated_filename}_optimized.gif")

            # Save the optimized frames as a new GIF file
            optimized_frames[0].save(
                optimized_output_filename,
                save_all=True,
                append_images=optimized_frames[1:],
                duration=duration,
                optimize=True,
                loop=0
            )

            print(f"Optimized GIF created: {optimized_output_filename}")
            print(f"Original GIF size: {filesize:.2f}kB")
            print(f"Optimized GIF size: {os.path.getsize(optimized_output_filename) / 1024:.2f}kB")
        else:
            print(f"GIF created successfully: {output_filename}")
            print(f"GIF size: {filesize:.2f}kB")

# Command-line arguments
input_folder = sys.argv[1]
output_folder = sys.argv[2]
filename = sys.argv[3]
duration = int(sys.argv[4])
max_size = int(sys.argv[5])

# Compile the GIF
compile_gif(input_folder, output_folder, filename, duration, max_size)
