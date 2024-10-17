namespace Projetos.LAPR5_3DC_G15.Domain.Shared
{
    public interface IMapper<TDomain, TDto, TCreatingDto>
    {
        TCreatingDto ToCreatingDto(TDomain domain);
        TDto ToDto(TDomain domain);
        TDomain ToDomain(TCreatingDto dto);
    }
}