export function kebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Add hyphen between lowercase and uppercase letters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase
}
