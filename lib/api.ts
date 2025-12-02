import { AuthResponse, SalesResponse, SalesFilters } from './types';

const API_BASE_URL = 'https://autobizz-425913.uc.r.appspot.com';

export async function getAuthToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/getAuthorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenType: 'frontEndTest',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get authorization token');
  }

  const data: AuthResponse = await response.json();
  return data.token;
}

export async function getSalesData(
  token: string,
  filters: SalesFilters
): Promise<SalesResponse> {
  const params = new URLSearchParams();

  params.append('startDate', filters.startDate);
  params.append('endDate', filters.endDate);
  params.append('priceMin', filters.priceMin || '');
  params.append('email', filters.email || '');
  params.append('phone', filters.phone || '');
  params.append('sortBy', filters.sortBy);
  params.append('sortOrder', filters.sortOrder);
  params.append('after', filters.after || '');
  params.append('before', filters.before || '');

  const response = await fetch(`${API_BASE_URL}/sales?${params.toString()}`, {
    headers: {
      'X-AUTOBIZZ-TOKEN': token,
    },
  });

  const data: SalesResponse = await response.json();


  console.log("Fetched Sales Data:", JSON.stringify(data, null, 2));

  return data;
}
