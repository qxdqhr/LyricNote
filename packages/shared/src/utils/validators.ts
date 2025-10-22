/**
 * 验证工具
 */

export const validators = {
  /**
   * 验证邮箱格式
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 验证密码强度
   */
  isValidPassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('密码长度至少6位');
    }

    if (password.length > 50) {
      errors.push('密码长度不能超过50位');
    }

    if (!/[a-zA-Z]/.test(password)) {
      errors.push('密码必须包含字母');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('密码必须包含数字');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * 验证用户名格式
   */
  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  /**
   * 验证文件大小
   */
  isValidFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  },

  /**
   * 验证音频文件类型
   */
  isValidAudioType(type: string, supportedTypes: string[]): boolean {
    return supportedTypes.includes(type);
  },
};
