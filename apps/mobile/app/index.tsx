import { Redirect } from 'expo-router';

/** App opens on Início; login is optional (guest browsing). */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
