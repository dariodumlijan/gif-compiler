# Sudar Automation

### Compile c++ code
```Bash
clang++ -o generate generate.cpp `Magick++-config --cppflags --cxxflags --ldflags --libs` -std=c++17
```