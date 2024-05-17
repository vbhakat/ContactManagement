namespace ContactsApi.Models.Contacts;

using System.ComponentModel.DataAnnotations;

public class CreateRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Phone { get; set; }
    [Required]
    public string Address { get; set; }

}