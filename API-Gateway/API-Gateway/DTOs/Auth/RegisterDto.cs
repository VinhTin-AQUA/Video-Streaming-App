using System.ComponentModel.DataAnnotations;

namespace API_Gateway.DTOs.Auth
{
    public class RegisterDto
    {
        [EmailAddress(ErrorMessage = "Email sai định dạng")]
        [Required(ErrorMessage = "Email không được bỏ trống")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được bỏ trống")]
        [StringLength(maximumLength: 16, MinimumLength = 8, ErrorMessage = "Mật khẩu ít nhất {2} ký tự và {1} ký tự")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên người dùng không được để trống")]
        public string FullName { get; set; } = string.Empty;
    }
}
