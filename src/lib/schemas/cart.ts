import { z } from 'zod';

/**
 * Contratos de validación (Búnker) para operaciones de carrito en el Frontend.
 * Garantizan que los datos enviados a las Edge Functions estén limpios,
 * evitando llamadas de red innecesarias y fallos inesperados.
 */

// Schema de validación para añadir o actualizar cantidad en el carrito (POST)
export const cartSyncSchema = z.object({
  product_id: z.string().uuid({ message: 'El ID del producto debe ser un UUID válido.' }),
  quantity: z.number()
    .int({ message: 'La cantidad debe ser un número entero.' })
    .positive({ message: 'La cantidad debe ser mayor a 0.' })
    .max(99, { message: 'No puedes añadir más de 99 unidades del mismo producto.' }),
});

// Schema de validación para eliminar un producto por completo del carrito (DELETE)
export const cartDeleteSchema = z.object({
  product_id: z.string().uuid({ message: 'El ID del producto debe ser un UUID válido.' }),
});

export type CartSyncInput = z.infer<typeof cartSyncSchema>;
export type CartDeleteInput = z.infer<typeof cartDeleteSchema>;
