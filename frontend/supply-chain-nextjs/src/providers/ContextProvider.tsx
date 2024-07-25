"use client";

import {
  Session,
  createKeyStoreInteractor,
  createSingleSigAuthDescriptorRegistration,
  createWeb3ProviderEvmKeyStore,
  hours,
  registerAccount,
  registrationStrategy,
  ttlLoginRule,
} from "@chromia/ft4";
import { createClient, IClient, NetworkSettings } from "postchain-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { getRandomUserName, uint8_to_hexStr } from "@/utils";
import { UserDto } from "@/app/users/Users";

interface GlobalContext {
  session: Session | undefined;
  account: UserDto | undefined;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

// Create context for Chromia session
const ChromiaContext = createContext<GlobalContext>({
  session: undefined,
  account: undefined,
});

export function ContextProvider({ children }: { children: ReactNode }) {
  const [globalState, setGlobalState] = useState<GlobalContext>({
    session: undefined,
    account: undefined,
  });
  const clientRef = useRef<IClient | null>(null);
  const router = useRouter();

  const getBlockchainRid = async () => {
    try {
      const req = await fetch("http://localhost:7740/brid/iid_0");
      const rid = await req.text();
      return rid;
    } catch (error) {
      console.error(error);
      return "0";
    }
  };

  const initClient = useCallback(async () => {
    if (clientRef.current) return;
    try {
      let isDevMode: boolean = false;
      if (typeof window !== "undefined") {
        const qs = window.location.search;
        const searchParams = new URLSearchParams(qs);
        isDevMode = searchParams.get("mode") === "dev";
      }

      const config: NetworkSettings = {
        blockchainRid: isDevMode
          ? await getBlockchainRid()
          : "DFF05EFA1231B815F13DD2A935C225D654625206C595259D794BCECCC459D391",
      };
      if (isDevMode) {
        config.nodeUrlPool = "http://localhost:7740";
      } else {
        config.directoryNodeUrlPool = [
          "https://node0.projectnet.chromia.dev:7740",
          "https://node1.projectnet.chromia.dev:7740",
          "https://node2.projectnet.chromia.dev:7740",
          "https://node3.projectnet.chromia.dev:7740",
        ];
      }

      const client = await createClient(config);
      clientRef.current = client;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const initSession = useCallback(async () => {
    try {
      const client = clientRef.current;
      if (!client || !window.ethereum) return;

      // 2. Connect with MetaMask
      const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);

      // 3. Get all accounts associated with evm address
      const evmKeyStoreInteractor = createKeyStoreInteractor(
        client,
        evmKeyStore,
      );
      const accounts = await evmKeyStoreInteractor.getAccounts();

      if (accounts.length > 0) {
        try {
          // 4. Start a new session
          const { session } = await evmKeyStoreInteractor.login({
            accountId: accounts[0].id,
            config: {
              rules: ttlLoginRule(hours(2)),
              flags: ["MySession"],
            },
          });
          setGlobalState((prev) => ({ ...prev, session }));
          toast.success("You've been logged in successfully!");
          router.push("/profile");
        } catch (error) {
          console.error(error);
          toast.error("Error logging in! Please try again.");
        }
      } else {
        // 5. Create a new account by signing a message using metamask
        const authDescriptor = createSingleSigAuthDescriptorRegistration(
          ["A", "T"],
          evmKeyStore.id,
        );

        try {
          const { session } = await registerAccount(
            client,
            evmKeyStore,
            registrationStrategy.open(authDescriptor, {
              config: {
                rules: ttlLoginRule(hours(2)),
                flags: ["MySession"],
              },
            }),
            {
              name: "register_user",
              args: [getRandomUserName(), uint8_to_hexStr(evmKeyStore.address)],
            },
          );
          setGlobalState((prev) => ({ ...prev, session }));
          toast.success("You've registered successfully.");
          router.push("/profile");
        } catch (error: any) {
          console.error(error);
          toast.error("Error registering your account! Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchUserAccount = useCallback(async () => {
    try {
      const session = globalState.session;
      if (!session) return;

      // @ts-ignore
      const user = await session.query<UserDto>({
        name: "get_user",
        args: {
          account_id: session.account.id,
        },
      });
      setGlobalState((prev) => ({ ...prev, account: user }));
    } catch (error) {
      console.error(error);
      toast.error("Error fetching account details! Please try again.");
    }
  }, [globalState.session]);

  useEffect(() => {
    initClient();
  }, [initClient]);

  useEffect(() => {
    window.addEventListener("register_account", initSession, false);

    return () => {
      window.removeEventListener("register_account", initSession, false);
    };
  }, [initSession]);

  useEffect(() => {
    fetchUserAccount();

    window.addEventListener("refetch_account", fetchUserAccount, false);

    return () => {
      window.removeEventListener("refetch_account", fetchUserAccount, false);
    };
  }, [fetchUserAccount]);

  return (
    <ChromiaContext.Provider value={globalState}>
      {children}
    </ChromiaContext.Provider>
  );
}

// Define hooks for accessing context
export function useSessionContext() {
  return useContext(ChromiaContext);
}
