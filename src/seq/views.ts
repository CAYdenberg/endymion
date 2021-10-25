import { View } from '../Http';

export const parseChroma: View<{}, {}> = async (req) => {
  console.log(req.file);

  return 'ok';
};
