import http from '~/utils/http'

export const countryApi = {
    getCountriesUser:() => http.get('countries'),
    getCountries: () => http.get('admin/countries')
}
