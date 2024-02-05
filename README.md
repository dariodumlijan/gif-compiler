# Gif Compiler

### Compile C++ code
- The commands for static build were found but static magick requires too many dependencies
  - Maybe it is possible to find a static/portable build online or use cmake to create the build

```Bash
# M1
clang++ -static -o generate generate.cpp \
-std=c++17 \
`Magick++-config --cppflags --cxxflags --ldflags --libs`
```

```Bash
# M1 - v2
clang++ -o generate generate.cpp \
-DMAGICKCORE_QUANTUM_DEPTH=16 -DMAGICKCORE_HDRI_ENABLE=0 -std=c++17 \
-I/opt/homebrew/Cellar/imagemagick/7.1.1-27/include/ImageMagick-7 \
-L/opt/homebrew/Cellar/imagemagick/7.1.1-27/lib \
-lMagick++-7.Q16HDRI \
-lMagickCore-7.Q16HDRI \
-lMagickWand-7.Q16HDRI
```

```Bash
# M1 - v2 (static)
clang++ -o generate generate.cpp \
-DMAGICKCORE_QUANTUM_DEPTH=16 -DMAGICKCORE_HDRI_ENABLE=0 -std=c++17 \
-I/opt/homebrew/Cellar/imagemagick/7.1.1-27/include/ImageMagick-7 \
-L/opt/homebrew/Cellar/imagemagick/7.1.1-27/lib \
/opt/homebrew/Cellar/imagemagick/7.1.1-27/lib/libMagick++-7.Q16HDRI.a \
/opt/homebrew/Cellar/imagemagick/7.1.1-27/lib/libMagickCore-7.Q16HDRI.a \
/opt/homebrew/Cellar/imagemagick/7.1.1-27/lib/libMagickWand-7.Q16HDRI.a
```

```Bash
# Intel
clang++ -o generate generate.cpp \
-std=c++17 -arch x86_64 \
`/usr/local/Cellar/imagemagick/7.1.1-12/bin/Magick++-config --cppflags --cxxflags --ldflags --libs`
```

```Bash
# Intel - v2
clang++ -o generate generate.cpp \
-DMAGICKCORE_QUANTUM_DEPTH=16 -DMAGICKCORE_HDRI_ENABLE=0 -std=c++17 -arch x86_64 \
-I/Users/dariodumlijan/projects/gif-compiler/scripts/magick/include \
-L/Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib \
-lMagick++-7.Q16HDRI \
-lMagickCore-7.Q16HDRI \
-lMagickWand-7.Q16HDRI
```

```Bash
# Intel - v2 (static)
clang++ -o generate generate.cpp \
-DMAGICKCORE_QUANTUM_DEPTH=16 -DMAGICKCORE_HDRI_ENABLE=0 -std=c++17 -arch x86_64 \
-I/Users/dariodumlijan/projects/gif-compiler/scripts/magick/include \
-L/Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib \
/Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagick++-7.Q16HDRI.a \
/Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagickCore-7.Q16HDRI.a \
/Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagickWand-7.Q16HDRI.a
```

### Check if generate executable has dynamic links
```Bash
otool -L generate
```

### Build
```Bash
# Universal
yarn electron:build

# M1
yarn electron:build --arm64

# Intel
yarn electron:build --x64
```

### After build process
1. Create ReadWrite copy of DMG
```Bash
hdiutil convert -format UDRW -o "ReadWriteVersion.dmg" "ReadVersion.dmg"
```
2. Add `preinstall` script to `ReadWriteVersion.dmg`
3. Convert `ReadWriteVersion.dmg` back to `read-only``
```Bash
hdiutil convert -format UDRO -o "ReadVersion.dmg" "ReadWriteVersion.dmg"
```
