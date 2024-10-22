namespace DDDSample1.Domain.Users;
public class ResetPasswordDTO
{   
    public string Email { get; set;}
    public string NewPassword { get; set; }
    public string NewPasswordConfirm { get; set; }
}
