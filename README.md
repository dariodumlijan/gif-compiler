# Gif Compiler

### Compile C++ code
```Bash
clang++ -o generate generate.cpp -std=c++17 -Ilibs -DMAGICKCORE_HDRI_ENABLE=0 -DMAGICKCORE_QUANTUM_DEPTH=16 -Llibs/ImageMagick-7.0.10/lib -lMagick++-7.Q16HDRI -lMagickWand-7.Q16HDRI -lMagickCore-7.Q16HDRI
```