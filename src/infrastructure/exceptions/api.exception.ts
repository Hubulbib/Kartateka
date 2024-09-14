export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors = [],
  ) {
    super(message)
  }

  static BadRequest = (message: string, errors = []) => {
    return new ApiError(400, message, errors)
  }

  static UnauthorizedError = () => {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static NotAccess = (message: string = 'Нет доступа к ресурсу') => {
    return new ApiError(403, message)
  }

  static NotFound = (message: string = 'Ресурс не найден') => {
    return new ApiError(404, message)
  }
}
