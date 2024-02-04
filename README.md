# Gif Compiler

### Compile C++ code
```Bash
# M1
clang++ -static -o generate generate.cpp `Magick++-config --cppflags --cxxflags --ldflags --libs` -std=c++17

# Intel
clang++ -static -o generate generate.cpp `/usr/local/Cellar/imagemagick/7.1.1-12/bin/Magick++-config --cppflags --cxxflags --ldflags --libs` -std=c++17 -arch x86_64

# Intel v2
clang++ -o generate generate.cpp `magick/bin/Magick++-config --cppflags --cxxflags --ldflags --libs` -std=c++17 -arch x86_64
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
