export const createRandomHexColor = () => {
  const hexChars = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 3; i++) {
    const component = Math.floor(Math.random() * 128);
    color += hexChars[Math.floor(component / 16)];
    color += hexChars[component % 16];
  }

  return color;
};
