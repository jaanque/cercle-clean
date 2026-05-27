import { z } from 'zod';

/**
 * Contratos de validación (Búnker) para operaciones de carrito en el Frontend.
 * Utiliza z.coerce.string() para tolerar tanto IDs numéricos (p. ej. 1) como cadenas (p. ej. "1"),
 * convirtiéndolos automáticamente a string para encajar con el contrato de la Edge Function.
 */

// Schema de validación para añadir o actualizar cantidad en el carrito (POST)
export const cartSyncSchema = z.object({
  product_id: z.coerce.string().min(1, { message: 'El ID del producto no puede estar vacío.' }),
  quantity: z.number()
    .int({ message: 'La cantidad debe ser un número entero.' })
    .positive({ message: 'La cantidad debe ser mayor a 0.' })
    .max(99, { message: 'No puedes añadir más de 99 unidades del mismo producto.' }),
});

// Schema de validación para eliminar un producto por completo del carrito (DELETE)
export const cartDeleteSchema = z.object({
  product_id: z.coerce.string().min(1, { message: 'El ID del producto no puede estar vacío.' }),
});

export type CartSyncInput = z.infer<typeof cartSyncSchema>;
export type CartDeleteInput = z.infer<typeof cartDeleteSchema>;



