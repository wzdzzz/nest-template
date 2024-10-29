import * as crypto from 'crypto';
import * as Process from 'node:process';

// key的长度必须为32bytes:
const key = Process.env.AES_SECRET_KEY;
// iv的长度必须为16bytes:
const iv = Process.env.AES_SECRET_VI;

/*
 * AES加密
 * @param {string} word
 * @return {string}
 * */
export function aes_encrypt(word: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(word, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/*
 * AES解密
 * @param {string} word
 * @return {string}
 * */
export function aes_decrypt(word: string) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(word, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
