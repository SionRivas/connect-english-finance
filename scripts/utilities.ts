import { addToast } from '@heroui/toast';

export function showToast(
  title: string,
  color: 'success' | 'danger' | 'warning' | 'primary',
  description?: string,
) {
  addToast({
    title,
    description,
    color,
  });
}
