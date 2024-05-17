namespace ContactsApi.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ContactsApi.Models.Contacts;
using ContactsApi.Services;

[ApiController]
[Route("[controller]")]
public class ContactsController : ControllerBase
{
    private IContactService _contactService;
    private IMapper _mapper;

    public ContactsController(
        IContactService contactService,
        IMapper mapper)
    {
        _contactService = contactService;
        _mapper = mapper;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var contacts = _contactService.GetAll();
        return Ok(contacts);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var contact = _contactService.GetById(id);
        return Ok(contact);
    }

    [HttpPost]
    public IActionResult Create(CreateRequest model)
    {
        _contactService.Create(model);
        return Ok(new { message = "Contact created" });
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, UpdateRequest model)
    {
        _contactService.Update(id, model);
        return Ok(new { message = "Contact updated" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _contactService.Delete(id);
        return Ok(new { message = "Contact deleted" });
    }
}