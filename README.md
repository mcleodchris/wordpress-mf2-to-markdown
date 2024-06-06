# Wordpress Microformats to Markdown

**Status:** Work in progress

Takes a Wordpress export that contains microformat data from the Post-Kinds plugin and exports the data to a series of Markdown files.

Similar in goal to https://github.com/lonekorean/wordpress-export-to-markdown, but when using that tool the Post-Kinds data is lost. For some items in the export this means there are empty Markdown files created with no usable information.

The intent of this tool is to export the microformat data to frontmatter, and group related kinds in a folder structure. e.g.:

```
- notes/
    - note1.md
    - note2.md
- likes/
    - like1.md
    - like2.md
- bookmarks/
    - bookmark1.md
    - bookmark2.md
```