# Gif Compiler

### Build
```Bash
export CSC_IDENTITY_AUTO_DISCOVERY=false

// Universal
yarn electron:build

// M1
yarn electron:build --arm64

// Intel
yarn electron:build --x64
```

### Compile C++ code
```Bash
// M1 - OLD
clang++ -o generate generate.cpp `Magick++-config --cppflags --cxxflags --ldflags --libs` -std=c++17

# // Universal
# clang++ -o generate -std=c++17 -Ilibs/arm64 generate.cpp -DMAGICKCORE_HDRI_ENABLE=0 -DMAGICKCORE_QUANTUM_DEPTH=16 \
#     -Llibs/arm64/lib -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk \
#     -lMagick++-7.Q16HDRI -lMagickWand-7.Q16HDRI -lMagickCore-7.Q16HDRI -lfreetype -lbz2 -lfontconfig

# // M1
# clang++ -o generate -std=c++17 -Ilibs/arm64 generate.cpp -DMAGICKCORE_HDRI_ENABLE=0 -DMAGICKCORE_QUANTUM_DEPTH=16 \
#     -Llibs/arm64/lib -arch arm64 -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk \
#     -target arm64-apple-macos11 -lMagick++-7.Q16HDRI -lMagickWand-7.Q16HDRI -lMagickCore-7.Q16HDRI -lfreetype -lbz2 -lfontconfig

# // Intel
# clang++ -o generate -std=c++17 -Ilibs/x86_64 generate.cpp -DMAGICKCORE_HDRI_ENABLE=0 -DMAGICKCORE_QUANTUM_DEPTH=16 \
#     -Llibs/x86_64/lib -arch x86_64 -isysroot /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk \
#     -target x86_64-apple-macos11 -lMagick++-7.Q16HDRI -lMagickWand-7.Q16HDRI -lMagickCore-7.Q16HDRI -lfreetype -lbz2 -lfontconfig

```