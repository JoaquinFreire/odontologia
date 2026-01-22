namespace Domain.Entities;
public class User
{
    public int id { get; set; } 
    public string email { get; set; } = string.Empty;  
    public string password_hash { get; set; } = string.Empty;  
    public string name { get; set; } = string.Empty;
    public string lastname { get; set; } = string.Empty;
    public string tuition { get; set; } = string.Empty;
}

