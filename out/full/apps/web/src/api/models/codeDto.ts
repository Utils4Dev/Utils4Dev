/**
 * Generated by orval v7.7.0 🍺
 * Do not edit manually.
 * Utils4Dev
 * OpenAPI spec version: 1.0
 */
import type { CodeLanguage } from './codeLanguage';
import type { UserDto } from './userDto';

export interface CodeDto {
  language: CodeLanguage;
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  content: string;
  private: boolean;
  author: UserDto;
}
