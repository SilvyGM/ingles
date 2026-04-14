import Swal from 'sweetalert2';

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Ocurrio un error inesperado.';
}

export async function showSuccess(title: string, text?: string) {
  await Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#dd6236',
  });
}

export async function showInfo(title: string, text?: string) {
  await Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonColor: '#0f887d',
  });
}

export async function showWarning(title: string, text?: string) {
  await Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#dd6236',
  });
}

export async function showError(title: string, error: unknown) {
  await Swal.fire({
    icon: 'error',
    title,
    text: extractErrorMessage(error),
    confirmButtonColor: '#b92e2e',
  });
}

export async function confirmDanger(title: string, text: string) {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Si, continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#b92e2e',
    cancelButtonColor: '#0f887d',
  });

  return result.isConfirmed;
}
