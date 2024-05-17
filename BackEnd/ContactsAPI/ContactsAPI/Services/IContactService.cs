namespace ContactsApi.Services;

using ContactsApi.Entities;
using ContactsApi.Models.Contacts;
public interface IContactService
{
    IEnumerable<Contact> GetAll();
    Contact GetById(int id);
    void Create(CreateRequest model);
    void Update(int id, UpdateRequest model);
    void Delete(int id);
}