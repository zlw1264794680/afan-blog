# 命令行操作

## 如何在 Windows 中使用 cmd 删除文件和文件夹

### del 删除文件

```bash
# 删除文件
del "<filename>"

# 强制删除文件
del /f "<filename>"

# 检查删除的文件
tree /f
```

### rmdir 删除文件夹

> 要删除目录或文件夹，你需要使用 `rmdir` 或 `rd` 命令。这两个命令的效果相同，但让我们常使用 `rmdir`。

```bash
# 删除文件夹
rmdir "<directory name>"

# 删除文件夹及子文件夹
rmdir /s "<directory name>"
```

