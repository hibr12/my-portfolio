class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
      success: true,
      message,
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data = null, message = 'Created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).end();
  }

  static paginated(res, data, total, page, limit) {
    return res.status(200).json({
      success: true,
      message: 'Success',
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  }
}

export default ApiResponse;
