# Gif Compiler

### Compile C++ code
```Bash
# M1
clang++ -static -o generate generate.cpp `Magick++-config --cppflags --cxxflags --ldflags --libs` -std=c++17

# Intel
clang++ -static -o generate generate.cpp `/usr/local/Cellar/imagemagick/7.1.1-12/bin/Magick++-config --cppflags --cxxflags --ldflags --libs` -std=c++17 -arch x86_64

# Intel v2
clang++ -o generate generate.cpp -I/Users/dariodumlijan/projects/gif-compiler/scripts/magick/include -L/Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib -lMagick++-7.Q16HDRI -lMagickCore-7.Q16HDRI -lMagickWand-7.Q16HDRI -DMAGICKCORE_QUANTUM_DEPTH=16 -DMAGICKCORE_HDRI_ENABLE=0 -std=c++17 -arch x86_64

clang++ -o generate generate.cpp -DMAGICKCORE_QUANTUM_DEPTH=16 -DMAGICKCORE_HDRI_ENABLE=0 -std=c++17 -arch x86_64 -I/Users/dariodumlijan/projects/gif-compiler/scripts/magick/include -L/Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib /Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagick++-7.Q16HDRI.a /Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagickCore-7.Q16HDRI.a /Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagickWand-7.Q16HDRI.a

clang++ -o generate generate.cpp -DMAGICKCORE_QUANTUM_DEPTH=16 -DMAGICKCORE_HDRI_ENABLE=0 -std=c++17 -arch x86_64 -I/Users/dariodumlijan/projects/gif-compiler/scripts/magick/include -L/Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib /Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagick++-7.Q16HDRI.a /Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagickCore-7.Q16HDRI.a /Users/dariodumlijan/projects/gif-compiler/scripts/magick/lib/libMagickWand-7.Q16HDRI.a -lbz2
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
