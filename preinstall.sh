#!/bin/bash

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Homebrew is not found. Installing..."

    # Install Homebrew
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    echo "Homebrew is installed."
else
    echo "Homebrew is already installed."
fi

# Check if the required C++ libraries are installed
if ! command -v magick &> /dev/null; then
    echo "The required C++ library is not found. Installing..."
    
    # Install the library using a package manager like Homebrew
    brew install imagemagick
    
    echo "The required C++ library is installed."
else
    echo "The required C++ library is already installed."
fi
