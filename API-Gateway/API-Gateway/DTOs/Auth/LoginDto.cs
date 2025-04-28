using System.ComponentModel.DataAnnotations;

namespace API_Gateway.DTOs.Auth
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Vui lòng nhập email")]
        [EmailAddress(ErrorMessage = "Email sai định dạng")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        public string Password { get; set; } = string.Empty;
    }
}
