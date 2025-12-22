import {createContext, PropsWithChildren, useMemo, useState} from "react";
import GithubApi from "../github.api.ts";
import {
    GithubRepositoryData,
    Organization,
    OrganizationId,
    OrganizationWithConfig,
    RepositoryGroupConfig,
    RepositoryId
} from "../domain.ts";
import {usePromise, UsePromiseStatus} from "../hooks/promise.hook.ts";
import {convertToOrganizationConfig} from "../utils/utils.ts";
import {useFilterConfig} from "../hooks/filter-config.hook.ts";
import GithubGraphql from "../github.graphql.ts";
import {useLocalStorage} from "@uidotdev/usehooks";

interface OrganizationsContextType {
    organizations: Organization[],
    organizationsLoadingStatus: UsePromiseStatus,
    selectedOrganization: OrganizationWithConfig | null,
    selectOrganization: (id: OrganizationId) => void
    fetchRepository: (organizationId: OrganizationId, groupConfig: RepositoryGroupConfig, repositoryId: RepositoryId) => Promise<GithubRepositoryData>
}

export const OrganizationsContext = createContext<OrganizationsContextType>({
    organizations: [],
    organizationsLoadingStatus: 'loading',
    selectedOrganization: null,
    selectOrganization: () => {
    },
    fetchRepository: () => Promise.resolve({
        latestRelease: null,
        pullRequests: [],
        branchCount: 0
    })
});

export const OrganizationsProvider = ({children}: PropsWithChildren) => {
    const [selectedOrganization, setSelectedOrganization] = useLocalStorage<OrganizationWithConfig | null>('selected-organization', null)
    const [repositoryCache, setRepositoryCache] = useState<Record<string, Promise<GithubRepositoryData> | undefined>>({})

    const {filterConfig} = useFilterConfig();

    const {status: organizationsLoadingStatus, result: organizations} = usePromise<Organization[]>(
        () => GithubApi.getOrganizations()
    );

    const effectiveSelectedOrganization = useMemo(() => {
        if (!selectedOrganization && organizations && organizations.length > 0) {
            return convertToOrganizationConfig(filterConfig, organizations[0])
        }
        return selectedOrganization
    }, [filterConfig, selectedOrganization, organizations])

    const selectOrganization = (id: OrganizationId) => {
        if (selectedOrganization?.id !== id) {
            const organization = organizations?.find(org => org.id === id) || null;
            setSelectedOrganization(convertToOrganizationConfig(filterConfig, organization));
        }
    };

    const fetchRepository = async (organizationId: OrganizationId, groupConfig: RepositoryGroupConfig, repositoryId: RepositoryId): Promise<GithubRepositoryData> => {
        const key = `${organizationId}-${repositoryId}`
        if (repositoryCache[key]) {
            return repositoryCache[key]
        }
        const repoPromise = GithubGraphql.getRepositoryData(organizationId, groupConfig, repositoryId);
        setRepositoryCache(prevState => ({...prevState, [key]: repoPromise}));
        return repoPromise;
    }

    const value: OrganizationsContextType = {
        organizations: organizations || [],
        organizationsLoadingStatus,
        selectedOrganization: effectiveSelectedOrganization,
        selectOrganization,
        fetchRepository
    };

    return <OrganizationsContext value={value}>{children}</OrganizationsContext>;
};