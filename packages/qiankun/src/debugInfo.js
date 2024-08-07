const LogLevel = {
  SUCCESS: '[成功]',
  INFO: '[信息]',
  WARN: '[警告]',
  ERROR: '[错误]',
};

const LogColor = {
  SUCCESS: '#52c41a',
  INFO: '#1890ff',
  WARN: '#faad14',
  ERROR: '#f5222d',
};

export const LogPrefix = {
  PROXY_SANDBOX: '[qiankun][proxySandbox]',
  LEGACY_SANDBOX: '[qiankun][legacySandbox]',
};

function log(level, color, prefix, message) {
  const style = `color: ${color};`;
  console.log(`%c${level}${prefix}`, style, message);
}

export function success(prefix, message) {
  log(LogLevel.SUCCESS, LogColor.SUCCESS, prefix, message);
}

export function info(prefix, message) {
  log(LogLevel.INFO, LogColor.INFO, prefix, message);
}

export function warn(prefix, message) {
  log(LogLevel.WARN, LogColor.WARN, prefix, message);
}

export function error(prefix, message) {
  log(LogLevel.ERROR, LogColor.ERROR, prefix, message);
}
