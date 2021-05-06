import { Heading } from '@chakra-ui/react';
import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Localisation } from '../../localisation/AppTexts';
import { Paths } from '../../Paths';
import { ReduxModel } from '../../redux/Store';
import ContentContainer from '../common/ContentContainer';

interface ReduxProps {
    loggedIn: boolean;
}

function mapStateToProps(reduxModel: ReduxModel): ReduxProps {
    return {
        loggedIn: reduxModel.user.loggedIn
    };
}

function InventoryMenu(props: ReduxProps) {
    if (!props.loggedIn) {
        return <Redirect to={Paths.BASE} />
    }

    return <ContentContainer>
        <Heading as="h2">{Localisation.INVENTORY}</Heading>
    </ContentContainer>
}

export default connect(mapStateToProps)(InventoryMenu);