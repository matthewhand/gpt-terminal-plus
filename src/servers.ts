type Server = {
    address: string;
    keyPath?: string; // Optional property to specify custom ssh key
    posix?: boolean; // Optional property to indicate if the server uses POSIX-style paths
    remoteInfo?: boolean; // Optional property to indicate if the remote system information should be automatically retrieved
  };
  
  const servers: Server[] = [
    { address: 'localhost', posix: false }, // TODO detect local posix
    { address: 'root@proxmox1.domain.home', keyPath: 'OneDrive\\Documents\\ssh-key-2023-07-12.key', posix: true, systemInfo: false },
    { address: 'root@proxmox2.domain.home', keyPath: 'OneDrive\\Documents\\ssh-key-2023-07-12.key', posix: true, systemInfo: false },
    { address: 'matthewh@ubuntu-amdgpu.domain.home', posix: true, systemInfo: true },
    { address: 'matthewh@ubuntu-gtx.domain.home'
    , keyPath: 'OneDrive\\Documents\\ssh-key-2023-06-13.key'
    , posix: true, // the server uses POSIX-style paths i.e. /
    },
    { address: 'matth@gamingpc' // netbios name
    , keyPath: 'OneDrive\\Documents\\ssh-key-2023-07-12.key'
    , posix: false, // the server uses Windows-style paths i.e. \
    },
    { address: 'matthewh@ubuntu-gamingpc.domain.home'
    , keyPath: 'OneDrive\\Documents\\ssh-key-2023-06-13.key'
    , posix: true, // the server uses POSIX-style paths i.e. /
    },
    { address: 'chatgpt@teamstinky.duckdns.org'  // dynamic dns
    , keyPath: 'OneDrive\\Documents\\ssh-key-2023-06-13.key'
    , posix: true, // the server uses POSIX-style paths i.e. /
    }
  ];
  
  export default servers;
  