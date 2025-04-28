namespace TranscodingService.Utils
{
    public static class DirectoryUtil
    {
        public static async Task DeleteDirectorySafeAsync(string directoryPath, int maxRetry = 5, int delayMs = 500)
        {
            if (!Directory.Exists(directoryPath))
                return;

            foreach (var filePath in Directory.GetFiles(directoryPath, "*", SearchOption.AllDirectories))
            {
                int retryCount = 0;
                while (true)
                {
                    try
                    {
                        File.Delete(filePath);
                        break;
                    }
                    catch (IOException) when (retryCount < maxRetry)
                    {
                        retryCount++;
                        await Task.Delay(delayMs);
                    }
                    catch (UnauthorizedAccessException) when (retryCount < maxRetry)
                    {
                        retryCount++;
                        await Task.Delay(delayMs);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to delete file {filePath}: {ex.Message}");
                        break;
                    }
                }
            }

            // Sau khi xóa hết file, xóa thư mục từ dưới lên
            foreach (var subDir in Directory.GetDirectories(directoryPath, "*", SearchOption.AllDirectories).OrderByDescending(s => s.Length))
            {
                try
                {
                    Directory.Delete(subDir, recursive: false);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete sub-directory {subDir}: {ex.Message}");
                }
            }

            // Cuối cùng xóa thư mục gốc
            try
            {
                Directory.Delete(directoryPath, recursive: false);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to delete root directory {directoryPath}: {ex.Message}");
            }
        }
    }
}
