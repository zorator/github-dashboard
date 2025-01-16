import {useEffect, useState} from "react";

import GithubApi, {OrganizationId, PullRequest, RepositoryConfig} from "../github.api.ts";
import PullRequestComponent from "./pull-request.component.tsx";

interface Props {
    organizationId: OrganizationId
    repositoryConfig: RepositoryConfig
}

function RepositoryComponent({repositoryConfig, organizationId}: Props) {

    const [prs, setPrs] = useState<PullRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        GithubApi.getPullRequests(organizationId, repositoryConfig)
            .then((prRes) => {
                setPrs(prRes);
                setLoading(false);
            })
            .catch((e: unknown) => {
                throw e;
            })
    }, [repositoryConfig, organizationId])

    return <div>
        <h3>{repositoryConfig.id}&nbsp;<a href={`https://github.com/${organizationId}/${repositoryConfig.id}/pulls`}
                                          target="_blank"
                                          rel="noreferrer">🌐</a></h3>
        {
            loading
                ? "Chargement en cours"
                : prs.map((pr) =>
                    <PullRequestComponent pullRequest={pr} key={pr.id}/>)
        }
    </div>
}


export default RepositoryComponent;
