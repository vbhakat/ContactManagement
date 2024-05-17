namespace ContactsApi.Helpers;

using AutoMapper;
using ContactsApi.Entities;
using ContactsApi.Models.Contacts;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // CreateRequest -> Contact
        CreateMap<CreateRequest, Contact>();

        // UpdateRequest -> Contact
        CreateMap<UpdateRequest, Contact>()
            .ForAllMembers(x => x.Condition(
                (src, dest, prop) =>
                {
                    // ignore both null & empty string properties
                    if (prop == null) return false;
                    if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;
                
                    return true;
                }
            ));
    }
}