import {createContext, PropsWithChildren, useMemo, useState} from "react";
import GithubApi from "../github.api.ts";
import {GithubRepositoryData, Organization, OrganizationWithConfig, OrganizationId, RepositoryConfig} from "../domain.ts";
import {usePromise, UsePromiseStatus} from "../hooks/promise.hook.ts";
import {convertToOrganizationConfig} from "../utils/utils.ts";
import {useFilterConfig} from "../hooks/filter-config.hook.ts";
import GithubGraphql from "../github.graphql.ts";

interface OrganizationsContextType {
    organizations: Organization[],
    organizationsLoadingStatus: UsePromiseStatus,
    selectedOrganization: OrganizationWithConfig | null,
    selectOrganization: (id: OrganizationId) => void
    fetchRepository: (organizationId: OrganizationId, repoConfig: RepositoryConfig) => Promise<GithubRepositoryData>
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
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationWithConfig | null>(null);
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

    const fetchRepository = async (organizationId: OrganizationId, repoConfig: RepositoryConfig): Promise<GithubRepositoryData> => {
        const key = `${organizationId}-${repoConfig.id}`
        if (repositoryCache[key]) {
            return repositoryCache[key]
        }
        const repoPromise = GithubGraphql.getRepositoryData(organizationId, repoConfig);
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