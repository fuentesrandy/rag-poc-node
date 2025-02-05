import { AppBar, Toolbar, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';

export default function NavBar() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button startIcon={<HomeIcon />} color="inherit">
            Home
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
} 