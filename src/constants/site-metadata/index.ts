const getAppUrl = () => {
  let url = process.env.APP_URL ?? 'https://oneacademy.id'
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }

  return url
}

export const siteMetadata = {
  name: 'One Academy',
  title: 'One Academy — Platform LMS Modern & Terintegrasi',
  description:
    'One Academy adalah platform Learning Management System (LMS) modular, modern, dan terintegrasi untuk seluruh jenjang pendidikan (SD, SMP, SMA, Perguruan Tinggi).',
  url: getAppUrl(),
  defaultTimezone: 'Asia/Jakarta'
}
