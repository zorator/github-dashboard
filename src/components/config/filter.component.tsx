import {useFilterConfig} from "../../hooks/filter-config.hook.ts";
import {useContext} from "react";
import {OrganizationsContext} from "../../contexts/organizations.context.tsx";
import {OrganizationConfigComponent} from "./organization-config.component.tsx";


export function FilterComponent() {
    const {filterConfig, setFilterConfig} = useFilterConfig()
    const {selectedOrganization} = useContext(OrganizationsContext)

    return selectedOrganization
        ? <OrganizationConfigComponent
            key={selectedOrganization.id}
            organization={selectedOrganization}
            groups={filterConfig[selectedOrganization.id] || []}
            setGroups={newConfig => {
                setFilterConfig({
                        ...filterConfig,
                        [selectedOrganization.id]: newConfig
                    }
                )
            }}/>
        : <p>Error</p>
}
