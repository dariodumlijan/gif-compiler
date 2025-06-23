# Gif Compiler

### Compile C++ code
- The commands for portable build were found but portable magick requires too many dependencies
  - Maybe it is possible to find a portable build online or use cmake to create the build

```sh
# Intel - x86_64
c++ -o ./scripts/generate ./scripts/generate.cpp \
`/usr/local/Cellar/imagemagick/7.1.1-12/bin/Magick++-config --cppflags --cxxflags --ldflags --libs` \
-std=c++17 -arch x86_64
```

```sh
# Intel - x86_64 - static (this compiles but still requires many deps)
export MAGICK_HOME="$PWD/scripts/magick"
export MAGICK_FLAGS="-Xpreprocessor -fopenmp -DMAGICKCORE_HDRI_ENABLE=1 -DMAGICKCORE_QUANTUM_DEPTH=16 -I$MAGICK_HOME/include/ImageMagick-7 -L$MAGICK_HOME/lib -lMagick++-7.Q16HDRI -lMagickWand-7.Q16HDRI -lMagickCore-7.Q16HDRI"
c++ -o ./scripts/generate ./scripts/generate.cpp `echo $MAGICK_FLAGS` -std=c++17 -arch x86_64

install_name_tool -change /ImageMagick-7.0.10/lib/libMagick++-7.Q16HDRI.4.dylib @executable_path/magick/lib/libMagick++-7.Q16HDRI.4.dylib ./scripts/generate
install_name_tool -change /ImageMagick-7.0.10/lib/lMagickWand-7.Q16HDRI.4.dylib @executable_path/magick/lib/lMagickWand-7.Q16HDRI.4.dylib ./scripts/generate
install_name_tool -change /ImageMagick-7.0.10/lib/lMagickCore-7.Q16HDRI.4.dylib @executable_path/magick/lib/lMagickCore-7.Q16HDRI.4.dylib ./scripts/generate
```

### Check if generate executable has dynamic links
```sh
otool -L generate
```

### Build
```sh
# Universal
yarn electron:build

# M1
yarn electron:build --arm64

# Intel
yarn electron:build --x64
```

### After build process
1. Create ReadWrite copy of DMG
```sh
hdiutil convert -format UDRW -o "ReadWriteVersion.dmg" "ReadVersion.dmg"
```
2. Add `preinstall` script to `ReadWriteVersion.dmg`
3. Convert `ReadWriteVersion.dmg` back to `read-only``
```sh
hdiutil convert -format UDRO -o "ReadVersion.dmg" "ReadWriteVersion.dmg"
```
