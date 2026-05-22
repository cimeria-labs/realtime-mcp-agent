import path from 'path';
import fs from 'fs';

export class SandboxManager {
  private sandboxRoot: string;

  constructor(rootPath?: string) {
    // Default to a 'sandbox' folder in the current working directory
    this.sandboxRoot = path.resolve(rootPath || path.join(process.cwd(), 'sandbox'));
    this.ensureSandboxExists();
  }

  private ensureSandboxExists() {
    if (!fs.existsSync(this.sandboxRoot)) {
      fs.mkdirSync(this.sandboxRoot, { recursive: true });
    }
  }

  /**
   * Validates if a path is within the sandbox boundaries.
   * Prevents path traversal attacks (e.g., ../../etc/passwd)
   */
  public validatePath(targetPath: string): boolean {
    const absolutePath = path.resolve(targetPath);
    return absolutePath.startsWith(this.sandboxRoot);
  }

  /**
   * Resolves a relative path to an absolute path within the sandbox.
   */
  public resolveToSandbox(relativePath: string): string {
    const resolved = path.resolve(this.sandboxRoot, relativePath);
    if (!this.validatePath(resolved)) {
      throw new Error(`Security Error: Attempt to access path outside sandbox: ${resolved}`);
    }
    return resolved;
  }

  public getRoot(): string {
    return this.sandboxRoot;
  }
}

export const defaultSandboxManager = new SandboxManager();
