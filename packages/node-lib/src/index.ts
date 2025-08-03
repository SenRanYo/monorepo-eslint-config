import { promises as fs } from 'fs';
import path from 'path';

export interface FileInfo {
  name: string;
  size: number;
  isDirectory: boolean;
}

/**
 * 获取目录中的文件信息
 */
export async function getFileInfo(dirPath: string): Promise<FileInfo[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    const fileInfos: FileInfo[] = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const stats = await fs.stat(fullPath);
      
      fileInfos.push({
        name: entry.name,
        size: stats.size,
        isDirectory: entry.isDirectory(),
      });
    }
    
    return fileInfos;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
}

/**
 * 创建目录（如果不存在）
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * 工具类
 */
export class FileUtils {
  static async readJsonFile<T = unknown>(filePath: string): Promise<T> {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }
  
  static async writeJsonFile(filePath: string, data: unknown): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
  }
}
