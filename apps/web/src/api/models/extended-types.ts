/**
 * Tipos estendidos para a API - incluem os campos adicionais não cobertos pela geração automática
 */
import { CodeDto, CreateCodeDto, UpdateCodeDto } from ".";

// Estende o CreateCodeDto para incluir keywords e description
export interface ExtendedCreateCodeDto extends CreateCodeDto {
  keywords?: string[];
  description?: string;
}

// Estende o UpdateCodeDto para incluir keywords e description
export interface ExtendedUpdateCodeDto extends UpdateCodeDto {
  keywords?: string[];
  description?: string;
}

// Estende o CodeDto para incluir keywords e description
export interface ExtendedCodeDto extends CodeDto {
  keywords?: string[];
  description?: string;
}
