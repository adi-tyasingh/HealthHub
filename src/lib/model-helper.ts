export function getSelectedModel(): string {
  // Try to get the model from localStorage if available
  if (typeof window !== 'undefined') {
    const storedModel = localStorage.getItem('selectedModel');
    if (storedModel) return storedModel;
  }

  // Check if the model is defined in environment variables
  const envModel = process.env.NEXT_PUBLIC_SELECTED_MODEL;
  if (envModel) return envModel;

  // Fallback to the default model
  return 'Heather';
}
