# Portfolio Asset Inventory

Project root inspected: `client-portfolio-assets`

Scope: This inventory covers the complete recursive contents of the asset library without modifying, moving, renaming, deleting, or compressing any files.

## 1) Folder and subfolder structure

```text
client-portfolio-assets/
├── Mr Jon/
│   └── Mrr Jon/
│       ├── Additional (1)/
│       │   └── Additional/
│       │       ├── Black Lion
│       │       ├── Cortado Coffee
│       │       ├── Game Zone
│       │       ├── Merit
│       │       ├── Picock Park
│       │       └── For Front Page.jpg
│       ├── Advert and Printing/
│       ├── Big Projects Own by Me/
│       │   ├── Amibara Real State/
│       │   └── Ephrata Specialty Coffee/
│       ├── main page/
│       │   └── For Front Page.jpg
│       ├── Projects done by colab/
│       │   ├── 1 Furi Coridor Cemnt Fabrica/
│       │   ├── 2 Wenz Dar Project Entoto/
│       │   ├── 3 Afincho Ber Bridge/
│       │   ├── 4 Picock Play Ground/
│       │   ├── 5 Piyassa Cark Park/
│       │   ├── 6 Furi Coridor 2/
│       │   ├── 7 PIcock River/
│       │   ├── 8 Ghion Park Line/
│       │   ├── 9 Afincho Ber Underground Ground/
│       │   ├── 10 Andromeda School/
│       │   ├── 11 Habesha Beer/
│       │   └── 12 Ghion Skate/
│       └── Small Projects/
│           ├── 1 Kiyta Bag/
│           ├── 2 Revive Coffee/
│           ├── 3 Liyu Bonda/
│           ├── 4 Emu Advert/
│           ├── 5 My Design/
│           ├── 6 Barkon Gym/
│           ├── 7 HomeGym Ermi/
│           └── 8 Kb/
```

## 2) Media totals

Total files found: 195

By file format:
- .HEIC: 66
- .JPG: 55
- .MOV: 18
- .PNG: 56

By category:
- Big Projects: 29 files (29 images, 0 videos)
- Collaborative Projects: 67 files (67 images, 0 videos)
- Small Projects: 21 files (18 images, 3 videos)
- Advertising & Printing: 38 files (37 images, 1 video)
- Additional / Misc: 39 files (25 images, 14 videos)
- main page: 1 file (1 image, 0 videos)

## 3) File formats inventory

Primary media formats in the asset library:
- JPG / JPEG: still photography and project documentation
- PNG: screenshots, export images, and visual references
- HEIC: high-volume mobile photo captures from the photo library
- MOV: short video clips accompanying project documentation

Notes:
- The library is strongly photography-heavy and mostly still-image based.
- The HEIC files are concentrated in the project photo captures and additional showcase folders.
- MOV files are concentrated in the Additional / Misc and Small Projects material, with a few isolated clips in the Advertising & Printing and other project sets.

## 4) Project names identified from folder names and files

### Big Projects (owned by Mr. Jon)
- Amibara Real State
- Ephrata Specialty Coffee

### Collaborative Projects
- 1 Furi Coridor Cemnt Fabrica
- 2 Wenz Dar Project Entoto
- 3 Afincho Ber Bridge
- 4 Picock Play Ground
- 5 Piyassa Cark Park
- 6 Furi Coridor 2
- 7 PIcock River
- 8 Ghion Park Line
- 9 Afincho Ber Underground Ground
- 10 Andromeda School
- 11 Habesha Beer
- 12 Ghion Skate

### Small Projects
- 1 Kiyta Bag
- 2 Revive Coffee
- 3 Liyu Bonda
- 4 Emu Advert
- 5 My Design
- 6 Barkon Gym
- 7 HomeGym Ermi
- 8 Kb

### Additional / misc project groups
- Black Lion
- Cortado Coffee
- Game Zone
- Merit
- Picock Park

### Advertising & Printing
- The Advertising & Printing folder contains many image exports and one MOV clip, but the files are primarily labeled by timestamps rather than formal campaign names.
- This section appears to be a mixed print/brand media archive rather than clearly named campaign folders.

## 5) Duplicate files

Only one confirmed duplicate content pair was detected by SHA256 hash comparison:

- `Mr Jon/Mrr Jon/Additional (1)/Additional/For Front Page.jpg`
- `Mr Jon/Mrr Jon/main page/For Front Page.jpg`

These are exact duplicates of the same file content.

This is likely intended as a copy used in the main page and an additional reference copy.

## 6) Missing or unreadable media

Findings:
- No missing files were detected by recursive filesystem inspection.
- No broken file references were found in the directory tree.
- No corrupt or unreadable files were identified from the chaining checks run against the asset set.
- The library does contain a large number of HEIC and MOV files, which may require HEIC/QuickTime-capable tooling to preview reliably in some software environments.
- The only notable caveat is format compatibility rather than true file loss or corruption.

## 7) Best candidate images for homepage hero and featured projects

### Best homepage hero candidate
- `Mr Jon/Mrr Jon/main page/For Front Page.jpg`
- This is the strongest candidate because it is explicitly named `For Front Page` and is located in the dedicated `main page` folder.
- It appears to be a clear, presentation-ready, full-size image intended for hero usage.

### Best featured project candidates
1. `Mr Jon/Mrr Jon/Big Projects Own by Me/Ephrata Specialty Coffee/2026_04_08_09_16_20_IMG_3040.JPG`
   - Best candidate for a major feature card or project spotlight.
   - It belongs to the most clearly named flagship big-project folder and presents a strong mural/commercial wall piece.

2. `Mr Jon/Mrr Jon/Big Projects Own by Me/Amibara Real State/...`
   - Strong alternative for a large project feature.
   - This folder is clearly branded as a large-scale own project and appears to contain multiple strong visual references.

3. `Mr Jon/Mrr Jon/Projects done by colab/1 Furi Coridor Cemnt Fabrica/...`
   - Strong collaborative project candidate for a featured gallery image or category highlight.

### Best visual balance for the site
- Use `For Front Page.jpg` as a hero image.
- Use an Ephrata or Amibara image for the first major feature panel.
- Use the collaborative project folders as secondary feature tiles or gallery entries.

## 8) Overall assessment

This asset library is rich and well organized for a portfolio site. The strongest content is concentrated in:
- `Big Projects Own by Me`
- `Projects done by colab`
- `main page`
- `Additional (1)/Additional`

The primary content gaps are not missing files, but rather the need for curation: several sections are large thematic archives, while some folders are more documentary than presentation-ready. The image set is suitable for a polished, photo-led mural portfolio with a strong mix of personal and collaborative work.
