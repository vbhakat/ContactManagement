namespace ContactsApi.Services;

using AutoMapper;
using ContactsApi.Entities;
using ContactsApi.Helpers;
using ContactsApi.Models.Contacts;

public class ContactService : IContactService
{
    private DataContext _context;
    private readonly IMapper _mapper;

    public ContactService(
        DataContext context,
        IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public IEnumerable<Contact> GetAll()
    {        
        return _context.Contacts;              
    }

    public Contact GetById(int id)
    {
        return getContact(id);
    }

    public void Create(CreateRequest model)
    {        
        // map model to new Contact object
        var contact = _mapper.Map<Contact>(model);        

        // save Contact
        _context.Contacts.Add(contact);
        _context.SaveChanges();
    }

    public void Update(int id, UpdateRequest model)
    {
        var Contact = getContact(id);

        // copy model to Contact and save
        _mapper.Map(model, Contact);
        _context.Contacts.Update(Contact);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var Contact = getContact(id);
        _context.Contacts.Remove(Contact);
        _context.SaveChanges();
    }

    // helper methods

    private Contact getContact(int id)
    {
        var Contact = _context.Contacts.Find(id);
        if (Contact == null) throw new KeyNotFoundException("Contact not found");
        return Contact;
    }
}